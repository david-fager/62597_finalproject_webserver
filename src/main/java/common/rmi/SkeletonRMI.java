package common.rmi;

import common.ResponseObject;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.sql.SQLException;

@SuppressWarnings("NonAsciiCharacters")
public interface SkeletonRMI extends Remote {

    ResponseObject getTables(String uuid) throws RemoteException;

    ResponseObject adminLogin(String username, String password) throws RemoteException;

    ResponseObject serverConnect(String stipulatedUUID) throws RemoteException;
    

    ResponseObject createUser(String uuid, String userName) throws RemoteException;

    ResponseObject getUser(String uuid, String userName) throws RemoteException;

    ResponseObject getUsers(String uuid) throws RemoteException;

    ResponseObject getCompleteUser(String uuid, String username) throws RemoteException, SQLException;

    ResponseObject updateUser(String uuid, String newUserName, int fid, String userName) throws RemoteException;

    ResponseObject deleteUser(String uuid, String userName) throws RemoteException;


    ResponseObject createItem(String uuid, String name, int typeid) throws RemoteException;

    ResponseObject getItem(String uuid, int itemid) throws RemoteException;

    ResponseObject getItems(String uuid) throws RemoteException;

    ResponseObject updateItem(String uuid, int itemid, String itemName, int typeid, int newItemid) throws RemoteException;

    ResponseObject deleteItem(String uuid, int itemid) throws RemoteException;


    ResponseObject createType(String uuid, String name, int keep) throws RemoteException;

    ResponseObject getType(String uuid, int typeid) throws RemoteException;

    ResponseObject getTypes(String uuid) throws RemoteException;

    ResponseObject updateType(String uuid, int typeid, String typeName, int keep, int newTypeid) throws RemoteException;

    ResponseObject deleteType(String uuid, int typeid) throws RemoteException;


    ResponseObject createFridgeRow(String uuid, int fid, int itemid, String expiration, int amount) throws RemoteException;

    ResponseObject getFridgeItem(String uuid, int fid, int itemid) throws RemoteException;

    ResponseObject getFridge(String uuid, int fid) throws RemoteException;

    ResponseObject getAllFridgeRows(String uuid) throws RemoteException;

    ResponseObject getFridgeContents(String uuid, int fid) throws RemoteException, SQLException;

    ResponseObject updateFridgeRow(String uuid, int fid, int itemid, int newFid, int newItemid, String newExpiration, int newAmount) throws RemoteException;

    ResponseObject deleteFridgeRow(String uuid, int fid, int itemid) throws RemoteException;

}
