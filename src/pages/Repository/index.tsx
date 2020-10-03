import React, { useState, useEffect } from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import api from '../../services/api'

import githubLogo from '../../assets/logo.svg'
import { Header, UserInfo, IssuesInfo } from './styles'

interface RepositoryParams {
    repository: string
}

interface Repository {
    full_name: string
    description: string
    stargazers_count: number
    forks_count: number
    open_issues_count: number
    owner: {
        login: string
        avatar_url: string
    }
}

interface Issue {
    id: number
    title: string
    html_url: string
    user: {
        login: string
    }
}


const Repository: React.FC = () => {

    const { params } = useRouteMatch<RepositoryParams>()
    const [repository, setRepository] = useState<Repository | null>(null)
    const [issues, setIssues] = useState<Issue[]>([])

    useEffect(() => {
        api.get(`repos/${params.repository}`).then(response => {
            setRepository(response.data)
        })

        api.get(`repos/${params.repository}/issues`).then(response => {
            setIssues(response.data)
        })

    }, [params.repository])

    return (
        <>
            <Header>
                <img src={githubLogo} alt="" />
                <Link to='/'>
                    <FiChevronLeft size={20} />
                Voltar
            </Link>
            </Header>

            {repository && (
                <UserInfo>
                    <header>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <p>Stars</p>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <p>Forks</p>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <p>Issues abertas</p>
                        </li>
                    </ul>
                </UserInfo>
            )}

            <IssuesInfo>
                {issues.map(issue => (
                    <a key={issue.id} href={issue.html_url}>
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>

                        <FiChevronRight size={30} />
                    </a>
                ))}
            </IssuesInfo>
        </>
    )
}

export default Repository
