import { tilesData } from '../constant'
import { Tile } from '../components'

export const Tiles = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center bg-primary-50-color '>
        <h1 className='fixed top-8 text-8xl font-mono text-white'>OTMS</h1>
        <div className='h-fit flex gap-6 flex-wrap p-8 rounded-lg  justify-center  w-1/2 '>
            {tilesData.map((tile) => <Tile name={tile.name} key={tile.id} url={tile.url} link={tile?.link} /> )}
        </div>
    </div>
  )
}
