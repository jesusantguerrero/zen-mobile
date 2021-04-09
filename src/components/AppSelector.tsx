import React from 'react';
import { Picker } from "@react-native-picker/picker";


export default function AppSelector({ data, value, onChange, isVisible = false,  onClose = false  } : AppSelectorProps) {
    return (
        <Picker
          testID="pckMatrix"
          mode="dialog"
          selectedValue={value}
          onValueChange={onChange}>
            { Object.entries(data).map(([matrixName, matrixItem]) => (<Picker.Item label={matrixItem.label} value={matrixName} />))}
        </Picker>
    )
}

type AppSelectorProps = {
    data: any,
    value: string,
    onChange: Function 
    isVisible: boolean,
    onClose: boolean | Function
} 