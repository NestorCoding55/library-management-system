# Use a basic Java image to build the app
FROM maven:3.9.6-eclipse-temurin-25 AS build
WORKDIR /app
COPY .. .
RUN mvn clean package -DskipTests

# Use a smaller Java image to run the app
FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]