import { readData } from '../../utils/db'

export default defineEventHandler(() => readData('events'))
