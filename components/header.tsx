
export const Header = ({onchange, onkeydown, onclick}:any) => {
    return (
        <div className={'w-full h-[50px] fixed top-[0] left-[0] z-10 bg-black'}>
            <div className={'w-auto h-auto absolute left-[10px] top-[7px] font-bold text-white text-[20px] text-red-500 '}>Examflix</div>
            <div className={'w-auto h-auto absolute left-[110px] top-[12.5px] text-white cursor-pointer'}>영화</div>
            <input type="text" onKeyDown={onkeydown} onChange={onchange} className={'w-auto h-auto absolute right-[50px]\
             top-[12.5px]  text-white cursor-pointer'} id={'search'}
                onClick={onclick}
            />
        </div>
    );
};
