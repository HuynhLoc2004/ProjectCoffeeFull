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
ENTRYPOINT ["java", "-jar", "app.jar"]