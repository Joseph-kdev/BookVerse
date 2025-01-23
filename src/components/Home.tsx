import Nav from './Nav'
import { useQuery } from '@tanstack/react-query'
import { getBestSellers } from '../services/requests'

export default function Home() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["bestSellers"],
        queryFn: getBestSellers,
        initialData: [],
    })

    if (isError) {
        return <div>Error loading data</div>
    }


  return (
    <div className='bg-[url("/homebg1.jpg")] bg-center bg-cover bg-fixed'>
        <Nav/>
        <section className='h-[50vh] flex justify-center items-center mx-1'>
            <div className='flex justify-center items-center'>
                <div className='min-w-[340px] min-h-[300px] mx-1 bg-[rgba(255,255,255,0.86)] md:w-[82vw] md:h-[50%] flex flex-col justify-center items-center'>
                    <div>
                        <h1 className='text-center text-3xl mb-3'>
                            Curate your E-BookShelf
                        </h1>
                        <p className='mb-3 text-center'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                        </p>
                    </div>
                    <button className='bg-white mt-2'>
                        Get Started
                    </button>
                </div>
            </div>
        </section>
        <section className='h-[50vh] flex flex-col items-center justify-center mt-6 bg-white'>
        <div className=''>
                <h1 className='text-2xl text-center'>
                    Start with these New York Times best sellers
                </h1>
            </div>
            <div className='w-[98%] flex items-center justify-center mt-5'>
                {isLoading && (
                    <div>
                        Loading books
                    </div>
                )}
                {isError && (
                    <div>
                        Couldn't find books
                    </div>
                )}
                <div className='w-full flex justify-evenly items-center flex-nowrap gap-2'>
                {data.map(book => (
                    <div key={book.title} className='max-w-[120px]'>
                            <img src={book.book_image} alt="" />
                    </div>
                ))}
                <div>
                    More
                </div>
                </div>
            </div>
        </section>
    </div>
  )
}
