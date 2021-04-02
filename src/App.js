import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import axios from 'axios'
import { render } from 'html-formatter'
import './App.css';

function App() {

  const [ links, setLinks ] = useState(undefined)
  
  let object = []

  // hacemos la consulta a la base de datos

  const getDataArray = async() => {
    await axios.get('http://localhost:3000/api/v1/catalog/products')
    .then(res => setLinks(res.data.message))    
  }

  useEffect(() => {
    getDataArray()
  },[])

  // cuando se cree el array metemos el contenido en el objecto

  if(Array.isArray(links)){
    links.forEach(prod => object.push(
      { 
        loc: `https://itamx.com/#/detalle/${prod._id}/${prod.title.replace(/[^a-zA-Z 0-9]+/g,'').trim().split(" ").join("-").toLowerCase()}`, 
        changefreq: "weekly"   
      }
      ))
  }

  // un Url que esta chido

  const Url = (props) => {
    return(
      <url>
        {
          Object.keys(props).map(Component => (
            <Component>{props[Component]}</Component>
          ))
        }
      </url>
    )
  }

  // creamos el documento

  const content = `
  
    ${render(
      renderToStaticMarkup(
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            {
              object.length > 0 && object.map((link) => 
                <Url {...link} />
              )
            }
        </urlset>
      )
    ).replace(/\t/g, "  ")}
  `

  return (
    <pre>{content}</pre>
  );

}

export default App;
