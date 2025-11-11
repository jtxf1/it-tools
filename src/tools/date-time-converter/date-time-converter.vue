<script setup lang="ts">
import type { DateFormat, ToDateMapper } from './date-time-converter.types'
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  isDate,
  isValid,
  parseISO,
  parseJSON,
} from 'date-fns'
import { useValidation } from '@/composable/validation'
import { withDefaultOnError } from '@/utils/defaults'
import {
  dateToExcelFormat,
  excelFormatToDate,
  isExcelFormat,
  isISO8601DateTimeString,
  isISO9075DateString,
  isMongoObjectId,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestamp,
  isUnixTimestamp,
  isUTCDateString,
} from './date-time-converter.models'

const inputDate = ref('')
const modal1 = ref()
const formattedValue = ref(null)

const toDate: ToDateMapper = date => new Date(date)

const formats: DateFormat[] = [
  {
    name: 'ISO 9075',
    fromDate: formatISO9075,
    toDate: parseISO,
    formatMatcher: date => isISO9075DateString(date),
  },
  {
    name: 'Unix timestamp',
    fromDate: date => String(getUnixTime(date)),
    toDate: sec => fromUnixTime(+sec),
    formatMatcher: date => isUnixTimestamp(date),
  },
  {
    name: 'Timestamp',
    fromDate: date => String(getTime(date)),
    toDate: ms => parseJSON(`${+ms}`),
    formatMatcher: date => isTimestamp(date),
  },
  {
    name: 'JS locale date string',
    fromDate: date => date.toString(),
    toDate,
    formatMatcher: () => false,
  },
  {
    name: 'ISO 8601',
    fromDate: formatISO,
    toDate: parseISO,
    formatMatcher: date => isISO8601DateTimeString(date),
  },
  {
    name: 'RFC 3339',
    fromDate: formatRFC3339,
    toDate,
    formatMatcher: date => isRFC3339DateString(date),
  },
  {
    name: 'RFC 7231',
    fromDate: formatRFC7231,
    toDate,
    formatMatcher: date => isRFC7231DateString(date),
  },
  {
    name: 'UTC format',
    fromDate: date => date.toUTCString(),
    toDate,
    formatMatcher: date => isUTCDateString(date),
  },
  {
    name: 'Mongo ObjectID',
    fromDate: date => `${Math.floor(date.getTime() / 1000).toString(16)}0000000000000000`,
    toDate: objectId => new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1000),
    formatMatcher: date => isMongoObjectId(date),
  },
  {
    name: 'Excel date/time',
    fromDate: date => dateToExcelFormat(date),
    toDate: excelFormatToDate,
    formatMatcher: isExcelFormat,
  },
  {
    name: 'yyyy-MM-dd',
    fromDate: date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    toDate: (dateString) => {
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year!, month! - 1, day)
    },
    formatMatcher: date => /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(date).getTime()),
    hide: true,
  },
  {
    name: 'HH:mm:ss',
    fromDate: date => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`,
    toDate: (timeString) => {
      const [hours, minutes, seconds] = timeString.split(':').map(Number)
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds)
    },
    formatMatcher: date => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(date),
    hide: true,
  },
]

const formatIndex = ref(6)
const now = useNow()

const normalizedDate = computed(() => {
  if (!inputDate.value) {
    return now.value
  }

  const { toDate } = formats[formatIndex.value]!

  try {
    return toDate(inputDate.value)
  }
  catch (_ignored) {
    return undefined
  }
})

function onDateInputChanged(value: string) {
  const matchingIndex = formats.findIndex(({ formatMatcher }) => formatMatcher(value))
  if (matchingIndex !== -1) {
    formatIndex.value = matchingIndex
  }
}

const validation = useValidation({
  source: inputDate,
  watch: [formatIndex],
  rules: [
    {
      message: 'This date is invalid for this format',
      validator: value =>
        withDefaultOnError(() => {
          if (value === '') {
            return true
          }

          const maybeDate = formats[formatIndex.value]!.toDate(value)
          return isDate(maybeDate) && isValid(maybeDate)
        }, false),
    },
  ],
})

function formatDateUsingFormatter(formatter: (date: Date) => string, date?: Date) {
  if (!date || !validation.isValid) {
    return ''
  }

  return withDefaultOnError(() => formatter(date), '')
}

function onChange1(v: number) {
  console.error(`Change-1 ${v}`)
  formatIndex.value = 0
  modal1.value.close()
  inputDate.value = formatDateUsingFormatter(formatISO9075, new Date(v))
}

function onClear() {
  modal1.value.close()
}
</script>

<template>
  <div>
    <div flex gap-2>
      <n-input-group>
        <c-input-text
          v-model:value="inputDate"
          autofocus
          placeholder="Put your date string here..."
          clearable
          test-id="date-time-converter-input"
          :validation="validation"
          @update:value="onDateInputChanged"
        />

        <c-button @click="() => modal1?.open()">
          选择时间
        </c-button>

        <c-modal ref="modal1" :overlay="false" flex justify-center items-center>
          <n-date-picker v-model:value="formattedValue" panel type="datetime" clearable @clear="onClear" @update:value="onChange1" />
        </c-modal>
        <c-select
          v-model:value="formatIndex"
          style="flex: 0 0 170px"
          :options="formats.filter(format => !format.hide).map(({ name }, i) => ({ label: name, value: i }))"
          data-test-id="date-time-converter-format-select"
        />
      </n-input-group>
    </div>

    <n-divider />

    <input-copyable
      v-for="{ name, fromDate } in formats"
      :key="name"
      :label="name"
      label-width="150px"
      label-position="left"
      label-align="right"
      :value="formatDateUsingFormatter(fromDate, normalizedDate)"
      placeholder="Invalid date..."
      :test-id="name"
      readonly
      mt-2
    />
  </div>
</template>
