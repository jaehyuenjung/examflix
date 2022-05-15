/* eslint-disable jsx-a11y/alt-text */
import { Carousel } from '@trendyol-js/react-carousel';
import Image from 'next/image';



export const Slider =({searchmovie}:any) => {
    return(
    <Carousel show={6} slide={6} swiping={true}>
                {searchmovie.map((index:any,key:any)=>{
                  return(
                    <>
                      <Image key={key} 
                      //className={'m-7  float-left rounded-lg cursor-pointer' }
                        src={index.src}
                        width={250}
                        height={200}  
                          onClick={e=>alert(index.src)}
                      />
                      <div className={'text-white'}>{index.id}</div>  
                    </>
                  )
                  })}
              </Carousel>
    );
}

