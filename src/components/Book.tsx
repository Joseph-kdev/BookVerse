import React, { useState } from 'react'
import { GoogleBook } from '../types'
import Modal from "react-modal"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function Book(props: GoogleBook) {
  const [modalIsOpen, setIsOpen] = useState(false);
    const truncateTitle = (title: string, maxLength: number): string => {
      if (!title) {
        return "";
      }
        if (title.length > maxLength) {
          return title.slice(0, maxLength) + '...';
        }
        return title;
      };

    const closeModal = () => {
      setIsOpen(false);
    }

    const openModal = () => {
      setIsOpen(true);
    }

  return (
    <>
      <div className='max-w-[140px] flex flex-col p-2'>
          <div className='w-full'>
            <a onClick={openModal} className='cursor-pointer'>
              <img src={props.imageLinks?.thumbnail} alt="book cover" className='w-full h-[180px]'/>
            </a>
          </div>
          <div>
              <h3 className='mt-1'>
                  {truncateTitle(props.title, 40)}
              </h3>
          </div>
      </div>
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Book Modal"
          style={customStyles}
          >
            <div className='flex gap-2 items-start max-w-[500px]'>
              <div className='min-w-[100px]'>
                <img src={props.imageLinks?.thumbnail} alt={props.title} />
                <div className='mt-3'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>

                </div>
              </div>
              <div>
                <div>
                  <h3>
                    {truncateTitle(props.title, 40)}
                  </h3>
                  <p>
                     {props.authors?.map(author => (
                      <p>
                       {author},
                     </p>
                    ))}
                  </p>
                  <p>
                    {truncateTitle(props.description, 200)} 
                    <a href="">
                      more
                    </a>
                  </p>
                </div>
              </div>
            </div>
      </Modal>
    </>
  )
}
