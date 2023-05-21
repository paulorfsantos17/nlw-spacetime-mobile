import { StatusBar } from 'expo-status-bar'
import { Text, ImageBackground, View, TouchableOpacity } from 'react-native'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import BlurBg from './src/assets/blur-bg.png'
import Stripes from './src/assets/stripes.svg'
import LogoNlw from './src/assets/logoNlw.svg'
import { styled } from 'nativewind'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from './src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/88aeea4aef1f6869727f',
}

export default function App() {
  const StripesStyle = styled(Stripes)

  const getToken = async (code: string) => {
    try {
      const registerResponse = await api.post('/register', {
        code,
      })
      const { token } = registerResponse.data
      console.log(token)
      return token
    } catch (error) {
      console.log(error)
    }
  }

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '88aeea4aef1f6869727f',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery
  )

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params
      console.log(code)
      const token = getToken(code)
    }
  }, [response])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={BlurBg}
      className="relative flex-1 items-center bg-gray-900 px-8 py-10"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StripesStyle className="absolute left-2" />
      <View className="flex-1 items-center justify-center gap-6">
        <LogoNlw />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full  bg-green-500 px-5 py-2 leading-relaxed"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm leading-none  text-black">
            Cadastra lembraça
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da <Text className="underline">Rocketseat</Text>
      </Text>
      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
