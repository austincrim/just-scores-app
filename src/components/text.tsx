import { ComponentProps } from "react"
import { Text as RNText, useColorScheme } from "react-native"
import colors from "tailwindcss/colors"

export function Text({
  children,
  ...props
}: { children: React.ReactNode } & ComponentProps<typeof RNText>) {
  let scheme = useColorScheme()
  let style = props.style ?? {}
  return (
    <RNText
      {...props}
      style={[
        { color: scheme === "dark" ? colors.zinc[100] : colors.zinc[800] },
        style,
      ]}
    >
      {children}
    </RNText>
  )
}
