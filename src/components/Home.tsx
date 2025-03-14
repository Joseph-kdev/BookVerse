import Nav from './Nav'
import { useQuery } from '@tanstack/react-query'
import { getBestSellers } from '../services/requests'
import { Link } from 'react-router-dom'

export default function Home() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["bestSellers"],
        queryFn: getBestSellers,
        initialData: [],
    })

  return (
    <div className='bg-[url("/homebg.jpg")] bg-center bg-cover bg-fixed'>
        <Nav/>
        <section className='h-[50vh] flex justify-center items-center mx-1 p-1'>
            <div className='flex justify-center items-center'>
                <div className='min-w-[340px] min-h-[300px] mx-1 bg-light-background dark:bg-dark-background md:w-[82vw] md:h-[50%] flex flex-col justify-center items-center bg-opacity-70 dark:bg-opacity-90'>
                    <div>
                        <h1 className='text-center text-4xl mb-3 text-light-text dark:text-dark-text'>
                            Curate your <span className=''>E-BookShelf</span>
                        </h1>
                        <p className='mb-3 text-center text-light-text dark:text-dark-text'>
                        Welcome to your digital haven for books! Manage 
                        your collection, track your favorites, and find new reads with ease.
                        </p>
                    </div>
                    <button className='bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text px-4 py-2 rounded-full mt-2'>
                        <Link to="/login">
                            Get Started
                        </Link>
                    </button>
                </div>
            </div>
        </section>
        <section className='bg-light-background dark:bg-dark-background p-2 md:p-[5%]'>            
        <div className='rounded-md h-[50vh] flex flex-col items-center justify-center mt-6 bg-light-primary dark:bg-dark-primary p-1'>
        <div className=''>
                <h1 className='text-2xl text-center text-light-background dark:text-dark-background'>
                    Start with these New York Times best sellers
                </h1>
            </div>
            <div className='w-[98%] flex items-center justify-center mt-5 text-light-background dark:text-dark-background p-1'>
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
                    <div key={book.title} className='max-w-[80px] md:max-w-[120px]'>
                            <img src={book.book_image} alt="" />
                    </div>
                ))}
                <div className='max-w-[80px] md:max-w-[120px] bg-light-secondary dark:bg-dark-secondary p-2 hover:bg-light-accent hover:text-light-text rounded-lg bg-center bg-cover'>
                    <Link to="/explore">
                        More
                    </Link>
                </div>
                </div>
            </div>
        </div>
        </section>
    </div>
  )
}
