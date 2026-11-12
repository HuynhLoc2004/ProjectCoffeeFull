# Stage 1: Build - Đổi sang JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY ProJectBackWeb/pom.xml .
COPY ProJectBackWeb/src ./src

RUN mvn clean package -DskipTests

# Stage 2: Run - Đổi sang JRE 21 cho nhẹ
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Tối ưu hóa JVM cho Render Free tier (512MB RAM, 0.5 CPU):
# -XX:+TieredCompilation -XX:TieredStopAtLevel=1: Giúp Spring Boot khởi động nhanh hơn 2-3 lần (bỏ qua JIT C2 nặng lúc boot)
# -XX:+UseSerialGC: Tiết kiệm RAM và CPU hơn G1 GC
# -XX:MaxRAMPercentage=75: Tránh bị Render OOM kill
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-Xss512k", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
