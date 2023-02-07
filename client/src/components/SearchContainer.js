import { useMemo, useState } from "react"
import {FormRow,FormRowSelect} from "."
import Wrapper from "../assets/wrappers/SearchContainer"
import { useAppContext } from "../context/appContext"

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('')
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    handleChange,
    clearFilters,
    jobTypeOptions,
    statusOptions
  }= useAppContext()

  const handleSearch= (e) => {
    if(isLoading) return
    handleChange({name:e.target.name,value:e.target.value})
    // console.log(e.target.name);
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalSearch('');
    clearFilters()
  }

  const debounce = () => {
    let timeoutID;
    return (e) => {  // returning this from the function and use it in useMemo
      setLocalSearch(e.target.value)
      clearTimeout(timeoutID)
      timeoutID = setTimeout(()=>{
        handleChange({name:e.target.name,value:e.target.value})
      },1000)
    }
  }

  const optimizedDebounce = useMemo(()=>debounce(),[])  // i want to get it once
  return (
    <Wrapper>
      <form className="form">
        <h4>Search Form</h4>
        <div className="form-center">
          {/* search position */}
          <FormRow 
            type="text"
            name="search"
            value={search} 
            handleChange={handleSearch}
            />
          {/* search by status */}
          <FormRowSelect 
          labelText='status' 
          name="searchStatus" 
          value={localSearch} 
          handleChange={optimizedDebounce}
          // handleChange={handleSearch}
          list={['all',...statusOptions]}
          />
          {/* search by type */}
          <FormRowSelect 
          labelText='type' 
          name="searchType" 
          value={searchType} 
          handleChange={handleSearch}
          list={['all',...jobTypeOptions]}
          />
          {/* search by sort */}
          <FormRowSelect 
          name="sort" 
          value={sort} 
          handleChange={handleSearch}
          list={sortOptions}
          />
          <button className="btn btn-block btn-danger" disabled={isLoading} onClick={handleSubmit} >clear filters</button>
        </div>
      </form>
    </Wrapper>
  )
}

export default SearchContainer