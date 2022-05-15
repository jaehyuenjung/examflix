import {Header} from '../components/header';
import {useState} from 'react';
import {Slider} from '../components/slider';

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
  

const Search=()=>{
    const [movies, setmovies] = useState(movie);

    const onchange = (event: any) => {
        if(event.target.value==''){
            setmovies(movie)
        }
      }
    
      console.log(movies)
    
      const onkeydown=(event:any) => {
        
        if(event.key=='Enter'){
          if(event.target.value==''){
            setmovies(movie)
    
          }else if(event.target.value!=''){
            setmovies(movies=>movies.filter(data => data.id==parseInt(event.target.value)))
          }
        }
      }

    return(
        <div className={'w-full h-full absolute bg-black '}>
            <Header onchange={onchange} onkeydown={onkeydown}/>
            <div  className={'absolute w-full top-[40%] bg-black'}>
            <Slider searchmovie={movies}/>
            </div>
        </div>
    );
};

export default Search;