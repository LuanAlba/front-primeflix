import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../services/api';
import './filme-info.css'

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilme() {
            await api.get(`/movie/${id}`, {
                params: {
                    api_key: "6cb4974c204511a10743cc0c18b32703",
                    language: "pt-BR",
                }
            })
                .then((response) => {
                    setFilme(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    navigate("/", { replace: true });
                    return;
                })
        }

        loadFilme();

        return () => {
            console.log("COMPONENTE FOI DESMONTADO")
        }
    }, [navigate, id])

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeflix");

        let filmesSalvos = JSON.parse(minhaLista) || [];

        const temFilme = filmesSalvos.some((filmesSalvo) => filmesSalvo.id === filme.id)
        if (temFilme) {
            alert("ESSE FILME JÁ ESTÁ NA LISTA");
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        alert("FILME SALVO COM SUCESSO");
    }

    if (loading) {
        return (
            <div className="filme-info">
                <h2>Carregando detalhes...</h2>
            </div>
        )
    }

    return (
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title} />

            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strong>Avaliação: {filme.vote_average.toFixed(1)} / 10</strong>

            <div className="area-buttons">
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a target="blank" rel="external" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                        Trailer
                    </a>
                </button>
            </div>

        </div>
    );
}

export default Filme;