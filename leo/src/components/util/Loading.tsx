import ReactLoading from 'react-loading';

export const Loader = () => (
    <div className='flex h-screen items-center justify-center'>
        <ReactLoading type='bars' color='#BABCBE' width={'5%'}/>
    </div>
);