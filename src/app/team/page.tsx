import CardLayout from "@/components/pages/team/ui/card-layout"
import { Metadata } from "next"
import {
  coPatrons,
  convenorData,
  coConvenorData,
  chiefPatron,
  patrons,
  facultyOrganizers,
  advisory,
  studentOrganizers,
  studentManagers,
} from "./team"
import ConvenerCard from "@/components/pages/team/ui/convener-cards"
import { Suspense } from "react"
import ScrollHandler from "@/components/transitions/scroll-handler"

export const metadata: Metadata = {
  title: "Team - Riviera 2026 | VIT Vellore",
  description:
    "Meet the passionate individuals behind Riviera26. Our dedicated team works tirelessly to create memorable experiences, foster community engagement, and drive innovation in every event we host.",
}

const TeamPage = () => {
  function getIdsFromName(name: string) {
    return name.toLocaleLowerCase().replace(/\s/g, "-").replace(/\./g, "")
  }

  return (
    <>
      <div className="bg-background w-full bg-[url('/assets/team/riv-grid.svg')] bg-contain pt-24">
        {/* Chief Patron Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-12 text-center text-6xl uppercase md:text-8xl">
            Chief Patron
          </h2>
          <div className="flex justify-center">
            {chiefPatron.map((member, index) => (
              <CardLayout
                key={index}
                image={member.image}
                name={member.name}
                designation={member.designation}
                designationBg="#FF44FF"
                className="aspect-square object-cover"
                size="lg"
                id={getIdsFromName(member.name)}
              />
            ))}
          </div>
        </section>

        {/* PATRONS Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-20 text-center text-6xl uppercase md:text-8xl">
            Patrons
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:px-16">
            {patrons.map((member, index) => (
              <CardLayout
                key={index}
                image={member.image}
                name={member.name}
                designation={member.designation}
                designationBg="#AD7CFF"
                size="lg"
                id={getIdsFromName(member.name)}
              />
            ))}
          </div>
        </section>

        {/* Co-Patrons COMMITTEE Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-20 text-center text-6xl uppercase md:text-8xl">
            Co-Patrons
          </h2>
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-wrap justify-center gap-10">
              {coPatrons.slice(0, 3).map((member, index) => (
                <CardLayout
                  key={index}
                  image={member.image}
                  name={member.name}
                  designation={member.designation}
                  designationBg="#AD7CFF"
                  size="lg"
                  id={getIdsFromName(member.name)}
                />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              {coPatrons.slice(3).map((member, index) => (
                <CardLayout
                  key={index + 3}
                  image={member.image}
                  name={member.name}
                  designation={member.designation}
                  designationBg="#AD7CFF"
                  size="lg"
                  id={getIdsFromName(member.name)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Convener Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-12 text-center text-6xl md:text-8xl">
            CONVENOR
          </h2>
          <div className="flex justify-center">
            {convenorData.map((member, index) => (
              <CardLayout
                key={index}
                image={member.image}
                name={member.name}
                designation={member.position}
                designationBg="#AD7CFF"
                size="lg"
                id={getIdsFromName(member.name)}
              />
            ))}
          </div>
        </section>
        {/* Co-Conveners Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-12 text-center text-6xl md:text-8xl">
            CO-CONVENORS
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {coConvenorData.map((member, index) => (
              <CardLayout
                key={index}
                image={member.image}
                name={member.name}
                designation={member.position}
                designationBg="#AD7CFF"
                size="lg"
                id={getIdsFromName(member.name)}
              />
            ))}
          </div>
        </section>

        {/* Advisory Committee Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-20 text-center text-6xl uppercase md:text-8xl">
            Advisory Committee
          </h2>
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-wrap justify-center gap-10">
              {advisory.map((member, index) => (
                <CardLayout
                  key={index}
                  image={member.image}
                  name={member.name}
                  designation={member.position}
                  designationBg="#AD7CFF"
                  size="lg"
                  id={getIdsFromName(member.name)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Faculty Organizers Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-12 text-center text-6xl uppercase md:text-8xl">
            Faculty Organizers
          </h2>
          <div className="grid grid-cols-2 flex-wrap justify-center gap-6 md:flex">
            {facultyOrganizers.map((member, index) => (
              <CardLayout
                key={index}
                image={member.image}
                name={member.name}
                designation={member.position}
                designationBg="#AD7CFF"
                size="md"
                id={getIdsFromName(member.name)}
                isOrg={true}
              />
            ))}
          </div>
        </section>

        {/* Student Organizers Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-12 text-center text-6xl uppercase md:text-8xl">
            Student Organizers
          </h2>
          <div className="grid grid-cols-2 flex-wrap justify-center gap-6 md:flex">
            {studentOrganizers.map((member, index) => (
              <CardLayout
                key={index}
                image={member.image ? member.image : "/assets/team/default.png"}
                name={member.name}
                designation={member.position}
                designationBg="#AD7CFF"
                size="md"
                className="object-bottom"
                id={getIdsFromName(member.name)}
                isOrg={true}
              />
            ))}
          </div>
        </section>

        {/* Faculty coordinator  Section */}
        {/* <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-12 text-center text-6xl md:text-8xl uppercase">
            Faculty coordinator
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {coConvenorData.map((member, index) => (
              <ConvenerCard
                key={index}
                name={member.name}
                designation={member.position}
                nameBg="white"
                nameColor="black"
                size="xs"
              />
            ))}
          </div>
        </section> */}

        {/* Student manager  Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-bebas-rounded text-foreground font-fk-trial mb-12 text-center text-6xl uppercase md:text-8xl">
            Student managers
          </h2>
          <div className="grid grid-cols-2 flex-wrap justify-center gap-6 md:flex">
            {studentManagers.map((member, index) => (
              <ConvenerCard
                key={index}
                name={member.name}
                designation={member.department}
                nameBg="white"
                nameColor="black"
                size="xs"
                id={member.name
                  .toLocaleLowerCase()
                  .replace(/\s/g, "-")
                  .replace(/\./g, "")}
              />
            ))}
          </div>
        </section>
      </div>
      <Suspense fallback={null}>
        <ScrollHandler offset={160} param="member" />
      </Suspense>
    </>
  )
}

export default TeamPage
