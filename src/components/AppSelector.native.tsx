import React from 'react';
import { Text, TouchableOpacity } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { FontAwesome5 } from "@expo/vector-icons"

const MatrixSelector = ({ value, placeholder} : { value: string, placeholder: string }) => {
    return (
      <TouchableOpacity style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesome5 color='white' name='list'  size={16}></FontAwesome5>
        <Text style={{ color: 'white', marginLeft: 5, textTransform: 'capitalize' }}> { value || placeholder }</Text>
      </TouchableOpacity>
    )
}

export default function AppSelector({ data, value, onChange, isVisible, onClose = false } : AppSelectorProps) {
 return (
    <ModalSelector
        data={data}
        visible={isVisible}
        onChange={(option)=> onChange(option.key)}
        onModalClose={() => onClose && onClose()}
        >
          <MatrixSelector value={value} placeholder="Set Quadrant">  </MatrixSelector>
    </ModalSelector>)   
}

export type AppSelectorProps = {
    data: any,
    value: string,
    onChange: Function 
    isVisible: boolean,
    onClose: boolean | Function
} 