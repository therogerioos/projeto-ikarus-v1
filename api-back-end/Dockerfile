FROM eclipse-temurin:17-jdk
ENV TZ=America/Sao_Paulo
WORKDIR /app
COPY target/auth-api-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
