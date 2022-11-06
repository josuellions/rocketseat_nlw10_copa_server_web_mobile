import { useEffect, useState } from 'react';
import { FlatList, useToast } from 'native-base';

import { api } from '../services/api';

import { Game, GameProps } from './Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast();
  
  const [ games, setGames ] = useState<GameProps[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ firstTeamPoints ,setFirstTeamPoints ] = useState('');
  const [ secondTeamPoints,setSecondTeamPoints ] = useState('');
 
  async function fetchGame () {
  try {
    setIsLoading(true);

    const response = await api.get(`/polls/${poolId}/games`);

    setGames(response.data.games)

  } catch (error) {
    console.log(error);

    toast.show({
      title: 'Falha ao carregar detalhes do bolões.',
      placement: 'top',
      bgColor: 'red.500'
    })

  } finally {
    setIsLoading(false);
  }
  }

  async function handleGuessesConfirm(gameId: string) {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim() ) {
        return toast.show({
                  title: 'Informe o placar do palpite!',
                  placement: 'top',
                  bgColor: 'blue.500'
                })
      }
      const pollId = poolId;

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });
    
      toast.show({
        title: 'Palpite realizado com!',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGame();

    } catch (error) {

      if(error.response?.data?.message === 'You already sent a guess to this game on this poll.') {
        return toast.show({
          title: 'Palpite já realizado nesse bolão!',
          placement: 'top',
          bgColor: 'blue.500'
        });
      }

      if(error.response?.data?.message === 'You cannot send guesses after the game date.') {
        return toast.show({
          title: 'Data desse bolão já passou!',
          placement: 'top',
          bgColor: 'blue.500'
        });
      }

      toast.show({
        title: 'Falha ao enviar seu palpite.',
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally {
     setFirstTeamPoints('')
     setSecondTeamPoints('')
    }
  }

 useEffect(() => {
  fetchGame()
 }, [poolId]);

 if(isLoading) {
  return <Loading />
 }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={ item } 
          setFirstTeamPoints={setFirstTeamPoints} 
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessesConfirm(item.id)}
          
        />
      )}
      _contentContainerStyle={{pb: 20}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  )
}
