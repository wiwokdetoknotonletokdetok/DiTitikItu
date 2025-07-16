import { Link } from 'react-router-dom'

interface FormRedirectLinkProps {
  question: string
  linkText: string
  to: string
}

const FormRedirectLink: React.FC<FormRedirectLinkProps> = ({ question, linkText, to }) => {
  return (
    <p className="mb-5 text-sm">
      {question}{' '}
      <Link to={to} className="text-[#1E497C] font-medium hover:underline">
        {linkText}
      </Link>
    </p>
  )
}

export default FormRedirectLink
