import React from 'react'

const Filters = ({ filters, onChange }) => {
  function handleInput(e) {
    onChange({ ...filters, [e.target.name]: e.target.value })
  }
  return (
    <div className="filters">
      <input
        name='customer'
        placeholder='Search Customer'
        value={filters.customer}
        onChange={handleInput}
      />
      <input
        name='partName'
        placeholder='Search Part Name'
        value={filters.partName}
        onChange={handleInput}
      />
      <input
        name='material'
        placeholder='Search Material'
        value={filters.material}
        onChange={handleInput}
      />
      <input
        name='startDate'
        type='date'
        value={filters.startDate}
        onChange={handleInput}
      />
      <input
        name='endDate'
        type='date'
        value={filters.endDate}
        onChange={handleInput}
      />
    </div>
  )
}

export default Filters