import './Header.css'
import { Text } from '../text/Text'

export const Header = ({
  headline,
  taglineA,
  taglineB,
}: {
  headline?: string;
  taglineA?: string;
  taglineB?: string;
}) => {
  return (
    <header>
      <Text level="h1" headline animate>
        {headline}
      </Text>
      <Text level="h1" style={{ marginBottom: '0'}}>
        {taglineA}
      </Text>
      <Text level="h1">
        {taglineB}
      </Text>
    </header>
  )
}