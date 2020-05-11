package common.rmi;

import common.ResponseObject;

import java.sql.SQLException;

@SuppressWarnings("NonAsciiCharacters")
public interface SkeletonRMI extends java.rmi.Remote {

    ResponseObject getTables(String uuid) throws java.rmi.RemoteException;

    ResponseObject login(String username, String password) throws java.rmi.RemoteException;

    ResponseObject validateUUID(String uuid) throws java.rmi.RemoteException;


    ResponseObject createUser(String uuid, String userName) throws java.rmi.RemoteException;

    ResponseObject getUser(String uuid, String userName) throws java.rmi.RemoteException;

    ResponseObject getUsers(String uuid) throws java.rmi.RemoteException;

    ResponseObject getCompleteUser(String uuid, String username) throws java.rmi.RemoteException, SQLException;

    ResponseObject updateUser(String uuid, String newUserName, int fid, String userName) throws java.rmi.RemoteException;

    ResponseObject deleteUser(String uuid, String userName) throws java.rmi.RemoteException;


    ResponseObject createItem(String uuid, String name, int typeid) throws java.rmi.RemoteException;

    ResponseObject getItem(String uuid, int itemid) throws java.rmi.RemoteException;

    ResponseObject getItems(String uuid) throws java.rmi.RemoteException;

    ResponseObject updateItem(String uuid, int itemid, String itemName, int typeid, int newItemid) throws java.rmi.RemoteException;

    ResponseObject deleteItem(String uuid, int itemid) throws java.rmi.RemoteException;


    ResponseObject createType(String uuid, String name, int keep) throws java.rmi.RemoteException;

    ResponseObject getType(String uuid, int typeid) throws java.rmi.RemoteException;

    ResponseObject getTypes(String uuid) throws java.rmi.RemoteException;

    ResponseObject updateType(String uuid, int typeid, String typeName, int keep, int newTypeid) throws java.rmi.RemoteException;

    ResponseObject deleteType(String uuid, int typeid) throws java.rmi.RemoteException;


    ResponseObject createFridgeRow(String uuid, int fid, int itemid, String expiration, int amount) throws java.rmi.RemoteException;

    ResponseObject getFridgeItem(String uuid, int fid, int itemid) throws java.rmi.RemoteException;

    ResponseObject getFridge(String uuid, int fid) throws java.rmi.RemoteException;

    ResponseObject getAllFridgeRows(String uuid) throws java.rmi.RemoteException;

    ResponseObject getFridgeContents(String uuid, int fid) throws java.rmi.RemoteException, SQLException;

    ResponseObject updateFridgeRow(String uuid, int fid, int itemid, int newFid, int newItemid, String newExpiration, int newAmount) throws java.rmi.RemoteException;

    ResponseObject deleteFridgeRow(String uuid, int fid, int itemid) throws java.rmi.RemoteException;

}
