import './Header.css'

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
      <h1 className="headline">
        {headline}
      </h1>
      <h1 className="tagline-a">
        {taglineA}
      </h1>
      <h1 className="tagline-b">
        {taglineB}
      </h1>
    </header>
  )
}