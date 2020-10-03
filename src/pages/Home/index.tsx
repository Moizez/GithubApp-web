import React, { useState, FormEvent, useEffect } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'

import githubLogo from '../../assets/logo.svg'
import { Title, Form, Repositories, Error } from './styles'

interface Repository {
    full_name: string
    description: string
    owner: {
        login: string
        avatar_url: string
    }
}

const Home: React.FC = () => {

    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem('@GithubApp: repositories')

        if (storageRepositories) {
            return JSON.parse(storageRepositories)
        }
        return []

    })
    const [search, setSearch] = useState('')
    const [inputError, setInputError] = useState('')

    useEffect(() => {
        localStorage.setItem('@GithubApp: repositories', JSON.stringify(repositories))
    }, [repositories])

    const handleAddRepository = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (!search) {
            setInputError('Digite autor/nome do repositório!')
            return
        }

        try {
            const response = await api.get<Repository>(`repos/${search}`)

            const repository = response.data

            setRepositories([...repositories, repository])
            setSearch('')
            setInputError('')
        } catch (err) {
            setInputError('Erro ao buscar este repositório!')
        }
    }

    return (
        <>
            <img src={githubLogo} alt="Github App" />
            <Title>Explore Repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={search}
                    onChange={(text) => setSearch(text.target.value)}
                    placeholder="Digite o nome do usuário e o repositório"
                />
                <button type="submit">Buscar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={30} />
                    </Link>
                ))}

            </Repositories>
        </>
    )
}

export default Home
