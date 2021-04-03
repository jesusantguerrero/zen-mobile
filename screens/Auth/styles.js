import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#4F5B7A",
        justifyContent: 'center',
        alignContent: 'center',
        color: "white",
    },
    logo: {
        flex: 1,
        height: 70,
        width: 70,
        alignSelf: "center",
        margin: 30,
        borderRadius: 10
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#059669',
        borderWidth: 2,
        borderColor: "white",
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    googleButton: {
        backgroundColor: '#06f',
        borderWidth: 2,
        borderColor: "white",
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#fff'
    },
    footerLink: {
        color: '#059669',
        fontWeight: "bold",
        fontSize: 16
    }
})