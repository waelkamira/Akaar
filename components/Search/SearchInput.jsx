"use client"
import { ImSearch } from "react-icons/im"
import SideBarMenu from "../navbars/SideBarMenu"
import { useSearch } from "../../contexts/SearchContext"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchInput() {
  const { setSearchQuery } = useSearch()
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue)
      router.push(`/search?query=${inputValue}`)
    }
  }

  return (
    <div className="flex relative flex-col items-center justify-center w-full pb-16">
      <div className=" w-full sm:w-2/3 p-2 sm:p-4 bg-primary-500 sm:bg-white sm:bg-opacity-75 sm:backdrop-blur-sm sm:rounded-lg shadow-lg flex justify-center items-center gap-2">
        <div className="sm:hidden">
          <SideBarMenu />{" "}
        </div>
        <Link href={"/search"}>
          <button
            onClick={() => setSearchQuery(inputValue)}
            className="flex justify-center items-center bg-primary-500 sm:text-lg text-sm text-white text-nowrap border border-gray-300 sm:border-none select-none rounded-md h-[32px] sm:h-[40px] xl:h-[50px] px-4 hover:bg-primary-500-dark transition-transform duration-300 hover:scale-105"
          >
            <span className="flex justify-center items-center gap-1 h-full cursor-pointer">
              <ImSearch className="mr-1" /> بحث
            </span>
          </button>
        </Link>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ابحث عن عقار أو سيارة..."
          className="flex-grow sm:text-lg text-sm text-gray-800 w-full text-nowrap select-none rounded-md h-[32px] sm:h-[40px] xl:h-[50px] p-2 focus:outline-none"
        />
      </div>
    </div>
  )
}

