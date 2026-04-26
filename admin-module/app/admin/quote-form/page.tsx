import { QuoteFormManager } from '../../../components/admin/QuoteFormManager'
import { createSupabaseServerClient } from '../../../lib/supabase-server'
import { defaultQuoteFormConfig, type QuoteFormConfig } from '../../../../src/components/site/contact-quote-form'

export default async function QuoteFormPage() {
  const supabase = await createSupabaseServerClient()
  const { data: row } = await supabase.from('content').select('value').eq('key', 'quote_form_config').maybeSingle()

  let config: QuoteFormConfig = defaultQuoteFormConfig
  if (row?.value) {
    try {
      const parsed = JSON.parse(row.value)
      config = {
        ...defaultQuoteFormConfig,
        ...parsed,
        eventOptions: Array.isArray(parsed?.eventOptions) ? parsed.eventOptions : defaultQuoteFormConfig.eventOptions,
        budgetOptions: Array.isArray(parsed?.budgetOptions) ? parsed.budgetOptions : defaultQuoteFormConfig.budgetOptions,
      }
    } catch {}
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">FORMULARZ WYCENY</h1>
      <QuoteFormManager initialConfig={config} />
    </div>
  )
}