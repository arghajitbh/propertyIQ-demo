# Build

FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime

FROM eclipse-temurin:17-jre

WORKDIR /app


COPY --from=build /app/target/*.jar app.jar
#COPY target/*.jar app.jar


ENV SPRING_APPLICATION_NAME=marketAPI
ENV SPRING_DATASOURCE_URL=jdbc:h2:mem:marketdb
ENV SERVER_PORT=8081
ENV PREDICTION_SERVICE_URL=http://localhost:8082

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
