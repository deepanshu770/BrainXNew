
import React from 'react'
import { Text, View, TextInput, Button, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { SafeAreaView } from 'react-native-safe-area-context'


const Login = () => {
    const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  })
  const onSubmit = (data:any) => console.log(data)
  return (
    <SafeAreaView style={{flex:1,paddingHorizontal:20}}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
            
            <TextInput
            placeholder="First name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={'grey'}
          />
        )}
        name="firstName"
      />
      {errors.firstName && <Text>This is required.</Text>}


      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Last name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={'grey'}

          />
        )}
        name="lastName"
      />


      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </SafeAreaView>
  )
}

export default Login
