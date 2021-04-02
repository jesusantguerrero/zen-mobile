import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
        width: "100%"
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
      },
      footer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        height: 20,
        width: "100%"
      },
      button: {
        width: 100,
        minWidth: "48%",
        color: "white",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        fontSize: 36
      },
      header: {
        backgroundColor: "red",
        borderBottomColor: "#333",
        borderBottomWidth: 2,
        height: 40,
        fontSize: 24,
        width: "100%"
      }
})