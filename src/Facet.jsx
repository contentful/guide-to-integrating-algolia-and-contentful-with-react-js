export const Facet = ({ facetKey, options, title, facetFiltersMap, onChange }) => {
  return (
    <div>
      <span className="facet-title">{title.toUpperCase()}</span>
      <div className="facet-options">
        {Object.entries(options).map(([facetOptionLabel, facetOptionQty], idx) => {
          const inputId = `input-${facetOptionLabel}-${idx}`
          return (
            <div className="facet-option" key={`${facetOptionLabel}-${idx}`}>
              <input
                id={inputId}
                type="checkbox"
                checked={facetFiltersMap.get(facetKey)?.includes(facetOptionLabel)}
                onChange={(e) => {
                  onChange(facetKey, e.target.value)
                }}
                value={facetOptionLabel}
              />
              <label htmlFor={inputId}>
                {facetOptionLabel} ({facetOptionQty})
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
