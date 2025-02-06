import React, { useMemo, useState } from "react";
import { useUserAuthContext } from "../config/UserAuthContext";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useQuery } from "@tanstack/react-query";
import Nav from "./Nav";
import Book from "./Book";

export default function Library() {
  const [filter, setFilter] = useState("favorite");

  const { user } = useUserAuthContext();
  // get books from firestore
  const fetchList = async (listType: string) => {
    const collectionRef = collection(db, `users/${user.uid}/${listType}`);
    const querySnapshot = await getDocs(collectionRef);
    const retrievedData = querySnapshot.docs.map((doc) => ({
        ...doc.data()
      }))
  
      return retrievedData
  };

  const { data: books, isLoading, isError } = useQuery({
    queryKey: ["books", filter],
    queryFn: () => fetchList(filter),
    enabled: !!user,
    initialData:[]
  });

  console.log(books);
  
  return (
    <>
      <Nav />
      {isLoading && <div>Loading</div>}
      {isError && <div>Error occured</div>}
      <div>
        <div>
          <select name="books-filter" value={filter} onChange={(event) => setFilter(event?.target.value)}>
            <option value="favorite">Favorites</option>
            <option value="reading-list">My Reading List</option>
            <option value="already-read">Already Read</option>
          </select>
        </div>
      </div>
                <div className='flex gap-2 w-full flex-wrap mt-2 justify-evenly lg:col-span-2 lg:ml-5 lg:max-w-[93%]'>
                  {books.map(bk => (
                    <Book key={bk.id} id={bk.id} title={bk.title} authors={bk.authors} description={bk.description} publisher={bk.publisher} categories={bk.categories} imageLinks={bk.imageLinks}/>
                          ))}
                </div>
    </>
  );
}
