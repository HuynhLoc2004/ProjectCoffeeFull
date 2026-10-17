import re
import subprocess
import os

def clean_sql():
    sql_lines = []
    sql_lines.append("SET session_replication_role = replica;")
    # Truncate fake orders and restore real data
    sql_lines.append("TRUNCATE TABLE orders_history CASCADE;")
    sql_lines.append("TRUNCATE TABLE orders CASCADE;")
    
    with open('data_only.sql', 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line_str = line.strip()
            if not line_str.startswith('INSERT [dbo].['):
                continue
            
            # Check which table
            m = re.match(r'INSERT \[dbo\]\.\[([a-zA-Z0-9_]+)\] \((.*?)\) VALUES \((.*)\)', line_str)
            if not m:
                continue
            
            table, cols, vals = m.groups()
            if table not in ['user_account', 'user_role', 'orders', 'orders_history']:
                continue
            
            # Clean columns
            clean_cols = cols.replace('[', '').replace(']', '')
            
            # Clean values
            clean_vals = vals
            # Replace CAST(N'...' AS DateTime2 / DateTime / Date)
            clean_vals = re.sub(r"CAST\((N?'.*?') AS [a-zA-Z0-9]+\)", r"\1", clean_vals)
            # Remove N' prefix
            clean_vals = re.sub(r"\bN'", "'", clean_vals)
            
            # user_account special handling
            if table == 'user_account':
                # Replace boolean integer literals: ', 1, ' -> ', true, '
                clean_vals = re.sub(r',\s*1\s*,', ', true,', clean_vals, count=1)
                clean_vals = re.sub(r',\s*0\s*,', ', false,', clean_vals, count=1)
                sql_lines.append(f"INSERT INTO {table} ({clean_cols}) VALUES ({clean_vals}) ON CONFLICT (id_user) DO UPDATE SET fullname = EXCLUDED.fullname, picture = EXCLUDED.picture, email_user = EXCLUDED.email_user, phone_user = EXCLUDED.phone_user;")
            elif table == 'user_role':
                sql_lines.append(f"INSERT INTO {table} ({clean_cols}) VALUES ({clean_vals}) ON CONFLICT DO NOTHING;")
            elif table == 'orders':
                sql_lines.append(f"INSERT INTO {table} ({clean_cols}) VALUES ({clean_vals}) ON CONFLICT (order_id) DO UPDATE SET total_price = EXCLUDED.total_price, status = EXCLUDED.status, user_id = EXCLUDED.user_id;")
            elif table == 'orders_history':
                sql_lines.append(f"INSERT INTO {table} ({clean_cols}) VALUES ({clean_vals}) ON CONFLICT (order_history_id) DO UPDATE SET total_price = EXCLUDED.total_price, status = EXCLUDED.status, user_id = EXCLUDED.user_id;")

    sql_lines.append("SET session_replication_role = origin;")
    
    out_file = 'real_imported_data.sql'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    print(f"Generated {len(sql_lines)} SQL statements in {out_file}")

if __name__ == '__main__':
    clean_sql()
