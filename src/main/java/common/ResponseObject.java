package common;

import java.io.Serializable;
import java.util.ArrayList;

public class ResponseObject implements Serializable {
    private static final long serialVersionUID = 42069;
    private int statusCode; // 0 = success, 1 = failed, 2 = exception, 3 = unauthorized, 4 = re-login
    private String statusMessage;
    private String responseString;
    private String[] responseStringArray;
    private ArrayList<String[]> responseArraylist;

    public ResponseObject(int statusCode, String statusMessage, String responseString, String[] responseStringArray, ArrayList<String[]> responseArraylist) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.responseString = responseString;
        this.responseStringArray = responseStringArray;
        this.responseArraylist = responseArraylist;
    }

    public ResponseObject() {
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public String getResponseString() {
        return responseString;
    }

    public void setResponseString(String responseString) {
        this.responseString = responseString;
    }

    public String[] getResponseStringArray() {
        return responseStringArray;
    }

    public void setResponseStringArray(String[] responseStringArray) {
        this.responseStringArray = responseStringArray;
    }

    public ArrayList<String[]> getResponseArraylist() {
        return responseArraylist;
    }

    public void setResponseArraylist(ArrayList<String[]> responseArraylist) {
        this.responseArraylist = responseArraylist;
    }

}
