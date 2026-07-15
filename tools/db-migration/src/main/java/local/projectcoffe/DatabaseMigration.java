package local.projectcoffe;

import java.net.URI;
import java.sql.*;
import java.util.*;

public final class DatabaseMigration {
    private static final List<String> TABLES = List.of(
            "permissions", "roles", "sizes", "topping", "products", "user_account",
            "invalid_refresh_tokens", "otp_email", "cart", "evaluate", "orders",
            "product_size", "product_topping", "roles_permission", "user_role",
            "cart_product", "order_details", "orders_history",
            "cart_product_topping", "order_details_topping"
    );

    private DatabaseMigration() {}

    public static void main(String[] args) throws Exception {
        String sourcePassword = required("SOURCE_DB_PASSWORD");
        String targetUrl = required("TARGET_DATABASE_URL");
        URI target = URI.create(targetUrl);
        String[] credentials = target.getUserInfo().split(":", 2);
        String targetJdbc = "jdbc:postgresql://" + target.getHost() + ":" + target.getPort()
                + target.getPath() + "?sslmode=require";
        String sourceJdbc = "jdbc:sqlserver://db:1433;databaseName=project_drink;encrypt=true;trustServerCertificate=true";

        try (Connection source = DriverManager.getConnection(sourceJdbc, "sa", sourcePassword);
             Connection destination = DriverManager.getConnection(targetJdbc, credentials[0], credentials[1])) {
            destination.setAutoCommit(false);
            execute(destination, "SET session_replication_role = replica");
            execute(destination, "ALTER TABLE orders ALTER COLUMN type_order DROP NOT NULL");
            execute(destination, "TRUNCATE TABLE " + String.join(", ", TABLES) + " RESTART IDENTITY CASCADE");

            for (String table : TABLES) {
                int copied = copyTable(source, destination, table);
                System.out.printf("COPIED %-28s %d%n", table, copied);
            }

            execute(destination, "SET session_replication_role = origin");
            resetSequences(destination);
            destination.commit();
            verify(source, destination);
        }
    }

    private static int copyTable(Connection source, Connection destination, String table) throws SQLException {
        Map<String, String> sourceColumns = columns(source, table);
        Map<String, String> targetColumns = columns(destination, table);
        List<String> common = targetColumns.keySet().stream()
                .filter(sourceColumns::containsKey)
                .toList();
        if (common.isEmpty()) {
            throw new SQLException("No common columns for table " + table);
        }

        String sourceList = common.stream().map(sourceColumns::get).map(DatabaseMigration::sqlServerName)
                .reduce((a, b) -> a + "," + b).orElseThrow();
        String targetList = common.stream().map(targetColumns::get).map(DatabaseMigration::postgresName)
                .reduce((a, b) -> a + "," + b).orElseThrow();
        String placeholders = String.join(",", Collections.nCopies(common.size(), "?"));
        String selectSql = "SELECT " + sourceList + " FROM " + sqlServerName(table);
        String insertSql = "INSERT INTO " + postgresName(table) + " (" + targetList + ") VALUES (" + placeholders + ")";

        int count = 0;
        try (Statement select = source.createStatement();
             ResultSet rows = select.executeQuery(selectSql);
             PreparedStatement insert = destination.prepareStatement(insertSql)) {
            while (rows.next()) {
                for (int i = 1; i <= common.size(); i++) {
                    Object value = rows.getObject(i);
                    insert.setObject(i, normalize(value));
                }
                insert.addBatch();
                count++;
                if (count % 500 == 0) insert.executeBatch();
            }
            insert.executeBatch();
        }
        return count;
    }

    private static Map<String, String> columns(Connection connection, String table) throws SQLException {
        boolean postgres = connection.getMetaData().getDatabaseProductName().toLowerCase(Locale.ROOT).contains("postgres");
        String sql = postgres
                ? "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=? ORDER BY ordinal_position"
                : "SELECT column_name FROM information_schema.columns WHERE table_schema='dbo' AND lower(table_name)=lower(?) ORDER BY ordinal_position";
        Map<String, String> result = new LinkedHashMap<>();
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, table);
            try (ResultSet rows = statement.executeQuery()) {
                while (rows.next()) {
                    String name = rows.getString(1);
                    result.put(name.toLowerCase(Locale.ROOT), name);
                }
            }
        }
        return result;
    }

    private static Object normalize(Object value) {
        if (value == null) return null;
        if (value.getClass().getName().equals("microsoft.sql.DateTimeOffset")) {
            return value.toString();
        }
        return value;
    }

    private static void resetSequences(Connection destination) throws SQLException {
        String sql = """
                SELECT table_name, column_name
                FROM information_schema.columns
                WHERE table_schema='public' AND is_identity='YES'
                """;
        try (Statement statement = destination.createStatement(); ResultSet rows = statement.executeQuery(sql)) {
            List<String[]> identities = new ArrayList<>();
            while (rows.next()) identities.add(new String[]{rows.getString(1), rows.getString(2)});
            for (String[] identity : identities) {
                String table = postgresName(identity[0]);
                String column = postgresName(identity[1]);
                String reset = "SELECT setval(pg_get_serial_sequence('" + identity[0] + "','" + identity[1]
                        + "'), COALESCE(MAX(" + column + "), 1), MAX(" + column + ") IS NOT NULL) FROM " + table;
                execute(destination, reset);
            }
        }
    }

    private static void verify(Connection source, Connection destination) throws SQLException {
        for (String table : TABLES) {
            long sourceCount = count(source, "SELECT COUNT(*) FROM " + sqlServerName(table));
            long targetCount = count(destination, "SELECT COUNT(*) FROM " + postgresName(table));
            if (sourceCount != targetCount) {
                throw new SQLException("Count mismatch for " + table + ": source=" + sourceCount + ", target=" + targetCount);
            }
            System.out.printf("VERIFIED %-26s %d%n", table, targetCount);
        }
    }

    private static long count(Connection connection, String sql) throws SQLException {
        try (Statement statement = connection.createStatement(); ResultSet rows = statement.executeQuery(sql)) {
            rows.next();
            return rows.getLong(1);
        }
    }

    private static void execute(Connection connection, String sql) throws SQLException {
        try (Statement statement = connection.createStatement()) {
            statement.execute(sql);
        }
    }

    private static String sqlServerName(String name) {
        return "[" + name.replace("]", "]]" ) + "]";
    }

    private static String postgresName(String name) {
        return "\"" + name.replace("\"", "\"\"") + "\"";
    }

    private static String required(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing environment variable " + name);
        return value;
    }
}
