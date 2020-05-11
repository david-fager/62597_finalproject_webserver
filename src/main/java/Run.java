import Javalin.Server;
import brugerautorisation.transport.rmi.Brugeradmin;
import common.rmi.SkeletonRMI;

import java.rmi.Naming;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Run {
    private static DateFormat df = new SimpleDateFormat("[dd-MM-yyyy HH:mm:ss]");
    private static Calendar calendar = Calendar.getInstance();

    public static void main(String[] args) {
        try {
            System.out.println(df.format(calendar.getTimeInMillis()) + " Starting server");

            // Connecting to the database program
            SkeletonRMI databaseServer = (SkeletonRMI) Naming.lookup("rmi://dist.saluton.dk:9921/my_fridge_rmi_remote");

            // Connecting to the user authentication module
            Brugeradmin javabogServer = (Brugeradmin) Naming.lookup("rmi://javabog.dk/brugeradmin");

            // Starting this javalin server
            Server server = new Server(databaseServer, javabogServer);
            server.initialize();

            printASCII();

            System.out.println(df.format(calendar.getTimeInMillis()) + " Server started");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void printASCII() {
        System.out.println("   ____   ____    _   _   ____    ____    _____     _    ___        ");
        System.out.println("  / ___| |  _ \\  | | | | |  _ \\  |  _ \\  | ____|   / |  / _ \\   ");
        System.out.println(" | |  _  | |_) | | | | | | |_) | | |_) | |  _|     | | | | | |      ");
        System.out.println(" | |_| | |  _ <  | |_| | |  __/  |  __/  | |___    | | | |_| |      ");
        System.out.println("  \\____| |_| \\_\\  \\___/  |_|     |_|     |_____|   |_|  \\___/  ");
        System.out.println("                                                                    ");
    }

}
