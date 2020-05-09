package Javalin;

public class UserProfile {
    String username;
    String javalin_uuid;
    String database_uuid;
    String ip;
    int fridgeID;

    @Override
    public String toString() {
        return "UserProfile{" +
                "username='" + username + '\'' +
                ", javalin_uuid='" + javalin_uuid + '\'' +
                ", database_uuid='" + database_uuid + '\'' +
                ", ip='" + ip + '\'' +
                ", fridgeID=" + fridgeID +
                '}';
    }

    public int getFridgeID() {
        return fridgeID;
    }

    public void setFridgeID(int fridgeID) {
        this.fridgeID = fridgeID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getJavalin_uuid() {
        return javalin_uuid;
    }

    public void setJavalin_uuid(String javalin_uuid) {
        this.javalin_uuid = javalin_uuid;
    }

    public String getDatabase_uuid() {
        return database_uuid;
    }

    public void setDatabase_uuid(String database_uuid) {
        this.database_uuid = database_uuid;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

}
