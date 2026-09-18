import mini from '../assets/mini-cutout.webp'
import economy from '../assets/economy-cutout.webp'
import compact from '../assets/compact-cutout.webp'
import suv from '../assets/suv-cutout.webp'

export const cars = [
  { id: 'mini', name: 'Mini', example: 'Fiat 500', price: 35, image: mini, seats: 4, bags: 1, transmission: 'manual' },
  { id: 'economy', name: 'Economy', example: 'Toyota Yaris', price: 40, image: economy, seats: 5, bags: 2, transmission: 'manual' },
  { id: 'compact', name: 'Compact', example: 'VW Polo', price: 45, image: compact, seats: 5, bags: 2, transmission: 'ac' },
  { id: 'suv', name: 'SUV', example: 'Suzuki Vitara', price: 55, image: suv, seats: 5, bags: 3, transmission: 'ac' },
]
