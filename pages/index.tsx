/* eslint-disable jsx-a11y/alt-text */
import type { NextPage } from "next";
import {Header} from "../components/header";
import {useState} from "react";
import Image from 'next/image';
//import { Carousel } from '@trendyol-js/react-carousel';
import {Slider} from '../components/slider';
import Link from "next/link";

const movie=[
  { id :1,
    src:'/images.jpg'
  },{
    id :2,
    src:'/images.jpg'
  },{
    id :3,
    src:'/images.jpg'
  },{
    id :4,
    src:'/images.jpg'
  },{
    id :5,
    src:'/다만악에서.jpg'
  },{
    id :6,
    src:'/images.jpg'
  },{
    id :7,
    src:'/images.jpg'
  },{
    id :8,
    src:'/images.jpg'
  },{
    id :9,
    src:'/다만악에서.jpg'
  },{
    id :10,
    src:'/images.jpg'
  }
]

const Home: NextPage = () => {
  const [searchmovie, setsearchmovie] = useState(movie);

  const onchange = (event: any) => {
    if(event.target.value==''){
      setsearchmovie(movie)
    }
  }

  console.log(searchmovie)

  const onkeydown=(event:any) => {
    
    if(event.key=='Enter'){
      if(event.target.value==''){
        setsearchmovie(movie)

      }else if(event.target.value!=''){
        setsearchmovie(searchmovie=>searchmovie.filter(data => data.id==parseInt(event.target.value)))
      }
    }
  }

  const onclick =() => {
    <Link href={"/search"}/>
  }

    return (
      <>

      <Header onchange={onchange} onkeydown={onkeydown} onclick={onclick}/>
      
      <div className={'bg-black w-full h-full absolute z-0 '} >
        <div className={'w-full h-[75%] bg-slate-400'}>
          <Image 
            src="/다만악에서.jpg"
            layout="fill"
            // width={1000}
            // height={600}
          /> 
          <div className={' w-auto h-auto absolute top-[28%] left-[50px] z-5  text-white text-[30px]'}
          >다만악에서 구하소서</div>
          <div className={' w-[400px] h-auto absolute top-[35%] left-[50px] z-5  text-white text-[15px]'}>
          태국에서 충격적인 납치사건이 발생하고 마지막 청부살인 미션을 끝낸 
          암살자 인남(황정민)은 그것이 자신과 관계된 것임을 알게 된다. 인남은 
          곧바로 태국으로 향하고, 조력자 유이(박정민)를 만나 사건을 쫓기 시작한다
          . 한편, 자신의 형제가 인남에게 암살당한 것을 알게 된 레이(이정재). 무자비
          한 복수를 계획한 레이는 인남을 추격하기 위해 태국으로 향하는데... 처절한 암
          살자 VS 무자비한 추격자 멈출 수 없는 두 남자의 지독한 추격이 시작된다!
          </div>
          <button className={'absolute left-[50px] top-[57%] text-[20px] rounded-sm w-[90px] h-[40px] bg-white'}>▶ 재생</button>
          <button className={'absolute left-[150px] top-[57%] text-[20px] text-white rounded-sm w-[100px] h-[40px] bg-stone-600'}>상세정보</button>
        </div> 

        <div className={'w-full h-auto left-[0]  bottom-[10px] relative'}>
            {/* <div className={'w-[50px] h-[100%] bg-slate-700 left-0 top-[0px] mr-[10px] absolute cursor-pointer'}></div> */}
              <Slider searchmovie={searchmovie}/>
              
            {/* <div className={'w-[50px] h-[100%] bg-slate-700 right-0 top-[0] absolute cursor-pointer'}></div> */}
        </div>
      </div>
      
      
      
      </>
    );
};

export default Home;
