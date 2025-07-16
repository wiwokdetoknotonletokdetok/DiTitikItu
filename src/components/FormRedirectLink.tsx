import { Link } from 'react-router-dom'

interface FormRedirectLinkProps {
  question: string
  linkText: string
  to: string
  className?: string
}

const FormRedirectLink: React.FC<FormRedirectLinkProps> = ({ question, linkText, to, className }) => {
  return (
    <p className={`text-sm ${className}`}>
      {question}{' '}
      <Link to={to} className="text-[#1E497C] font-medium hover:underline">
        {linkText}
      </Link>
    </p>
  )
}

export default FormRedirectLink
