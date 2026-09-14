
import React from 'react';
import { List } from 'lucide-react';

const Missions = () => {
  const missions = [
    "Assurer une continuité du service public d'éducation aux enfants français, et donner accès à l'enseignement français aux enfants d'autres nationalités",
    "Contribuer au rayonnement de la langue et de la culture françaises",
    "Veiller au respect des principes de l'école inclusive envers les élèves à besoins éducatifs particuliers",
    "Former des citoyens multilingues, écoresponsables, ouverts au monde et capables de s'adapter à la digitalisation croissante de nos sociétés",
    "Développer et faire vivre au sein de l'établissement les valeurs humanistes du vivre-ensemble et les principes de laïcité, d'inclusion et d'égalité",
    "Assurer une coéducation en impliquant les parents d'élèves à la vie de l'établissement",
    "Favoriser l'autonomie de l'élève afin de lui permettre d'élaborer son projet personnel, en se projetant vers l'enseignement supérieur et en se préparant à l'exercice de la citoyenneté",
    "Développer la curiosité intellectuelle des élèves",
    "Favoriser l'accès aux outils numériques et accompagner l'appropriation des dernières innovations technologiques",
    "Offrir à nos élèves un corps enseignant compétent, passionné et reconnu pour son investissement",
    "Créer un environnement favorable à l'épanouissement personnel de chaque élève au sein de l'établissement",
    "Mettre à disposition des locaux modernes et adaptés, propices aux apprentissages",
    "Développer des filières internationales, des coopérations éducatives locales et des partenariats extérieurs",
    "Financer le Plan Stratégique de Développement et optimiser la gestion des ressources nécessaires à sa mise en œuvre"
  ];

  return (
    <section id="missions" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/3 flex md:flex-col items-start md:items-center gap-4 text-left md:text-center">
            <div className="w-24 h-24 rounded-full bg-french-blue bg-opacity-10 flex items-center justify-center mx-auto">
              <List size={48} className="text-french-blue" />
            </div>

            <h2 className="text-3xl font-playfair font-bold text-french-blue flex items-center">
              <span className="mr-2">2.</span>
              NOS MISSIONS
            </h2>
          </div>
          
          <div className="w-full md:w-2/3">
            <ul className="space-y-4">
              {missions.map((mission, index) => (
                <li key={index} className="flex items-start font-raleway opacity-0 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="inline-flex items-center justify-center rounded-full bg-french-blue h-6 w-6 text-white text-sm shrink-0 mt-0.5 mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Missions;
