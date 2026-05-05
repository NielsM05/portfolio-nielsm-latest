const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_NL = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']

export function useFormatMonth() {
  const { locale } = useLocale()

  function formatMonth(yyyyMM: string): string {
    if (!yyyyMM) return ''
    const [year, month] = yyyyMM.split('-')
    const idx = parseInt(month, 10) - 1
    const months = locale.value === 'nl' ? MONTHS_NL : MONTHS_EN
    return `${months[idx]} ${year}`
  }

  return { formatMonth }
}
