import { useState, useCallback, useMemo, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


function App() {

  const [products, setProducts] = useState([])
  const [textProduct, setTextProduct] = useState("")
  const [selectedProduct, setSelectedProduct] = useState (null)


  //funzione debounce
   function debounce(callback, delay) {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        callback(...args)
      }, delay)
    }
  }

  //fetch dei products
  const fetchProducts = async (query) => {
      try {
        const response = await fetch(`http://localhost:3333/products?search=${query}`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Errore nel fetch:", error)
      }
    }

    //fetch prodotto singolo
    const fetchSingleProduct = async(id) => {
      try{
        const response = await fetch(`http://localhost:3333/products/${id}`)
        const data = await response.json()
        setSelectedProduct(data)
      }catch(error){
        console.error("Errore nel fetch:", error)
      }
    }

    //fetch debounced solo versione più pulita e chiara da leggere
    const debouncedFetchProducts = useMemo(
      () => debounce(fetchProducts, 300),
      []
    )
  

  // effettuo la chiamata API ogni volta che cambia textProduct
  useEffect(() => {
    if (textProduct.trim() === "") {
      setProducts([]) // se il campo è vuoto, svuota i suggerimenti
      return
    }
    debouncedFetchProducts(textProduct)
  }, [textProduct, debouncedFetchProducts])

  // console.log(products)


  return (
    <>
      <input type="text"
        value={textProduct}
        onChange={e => {
          setTextProduct(e.target.value)
          setSelectedProduct(null)
        }}
        placeholder = "Cerca qui il tuo prodotto..." />

        {products.length > 0 && (
        <ul>
          {products.map(product => (
            <li
              key={product.id}
              onClick={() => {
                setTextProduct(product.name)
                setProducts([])
                fetchSingleProduct(product.id)
              }}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}

      {selectedProduct && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.name} width="200" />
          <p>{selectedProduct.description}</p>
          <p><strong>Prezzo:</strong> €{selectedProduct.price}</p>
        </div>
      )}
    </>
  )
}

export default App
