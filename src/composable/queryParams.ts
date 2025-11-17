/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref, UnwrapRef } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { computed } from 'vue'

export { useQueryParam, useQueryParamOrStorage }

const transformers = {
  number: {
    fromQuery: (value: string) => Number(value),
    toQuery: (value: number) => String(value),
  },
  string: {
    fromQuery: (value: string) => value,
    toQuery: (value: string) => value,
  },
  boolean: {
    fromQuery: (value: string) => value.toLowerCase() === 'true',
    toQuery: (value: boolean) => (value ? 'true' : 'false'),
  },
  object: {
    fromQuery: (value: string) => {
      return JSON.parse(value)
    },
    toQuery: (value: object) => JSON.stringify(value),
  },
}

function useQueryParam<T>({ name, defaultValue }: { name: string; defaultValue: T }) {
  const type = typeof defaultValue
  const transformer = transformers[type as keyof typeof transformers] ?? transformers.string

  const proxy = useRouteQuery(name, transformer.toQuery(defaultValue as never))

  return computed<T>({
    get() {
      return transformer.fromQuery(proxy.value) as unknown as T
    },
    set(value) {
      proxy.value = transformer.toQuery(value as never)
    },
  })
}

// 定义IfAny类型工具
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

function useQueryParamOrStorage<T>({
  name,
  storageName,
  defaultValue,
}: {
  name: string
  storageName: string
  defaultValue: T
}): [T] extends [Ref<any, any>] ? IfAny<T, Ref<T, T>, T> : Ref<UnwrapRef<T>, T | UnwrapRef<T>> {
  const type = typeof defaultValue
  const transformer = transformers[type as keyof typeof transformers] ?? transformers.string

  const storageRef = useStorage(storageName, defaultValue)
  const proxyDefaultValue = transformer.toQuery(defaultValue as never)
  const proxy = useRouteQuery(name, proxyDefaultValue)

  const r = ref(defaultValue)

  watch(
    r,
    (value) => {
      proxy.value = transformer.toQuery(value as never)
      storageRef.value = value as never
    },
    { deep: true },
  )

  r.value = (
    proxy.value && proxy.value !== proxyDefaultValue
      ? (transformer.fromQuery(proxy.value) as unknown as T)
      : (storageRef.value as T)
  ) as never

  return r
}
