import { ComponentProps } from "react"
import { Text as RNText } from "react-native"
import colors from "tailwindcss/colors"

export function Text({
  children,
  ...props
}: { children: React.ReactNode } & ComponentProps<typeof RNText>) {
  let style = props.style ?? {}
  return (
    <RNText {...props} style={[{ color: colors.zinc[100] }, style]}>
      {children}
    </RNText>
  )
}
