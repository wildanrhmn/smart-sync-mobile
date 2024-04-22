import { Redirect, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../../context/GlobalProvider'
import Loader from '../../components/Loader'

const AuthLayout = () => {
  const { loading, isLoggedIn } = useGlobalContext()

  if(!loading && isLoggedIn) return <Redirect href="/home" />

  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar style="light" backgroundColor='#161622' />
    </>
  )
}

export default AuthLayout