import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Gauge, Ruler, Zap, Calendar, MapPin } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { NearEarthObjects } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function NEODetailPage() {
  const { id } = useParams<{ id: string }>();
  const [neo, setNeo] = useState<NearEarthObjects | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNEO();
  }, [id]);

  const loadNEO = async () => {
    setIsLoading(true);
    const data = await BaseCrudService.getById<NearEarthObjects>('nearearthobjects', id!);
    setNeo(data);
    setIsLoading(false);
  };

  const getRiskLevel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 7) return 'High Risk';
    if (score >= 4) return 'Moderate Risk';
    return 'Low Risk';
  };

  const getRiskColor = (score?: number) => {
    if (!score) return 'text-secondary-foreground';
    if (score >= 7) return 'text-destructive';
    if (score >= 4) return 'text-accentcyan';
    return 'text-secondary-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {isLoading ? (
          <div className="min-h-[600px] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : !neo ? (
          <div className="min-h-[600px] flex flex-col items-center justify-center px-8">
            <AlertTriangle className="w-20 h-20 text-secondary-foreground opacity-30 mb-6" />
            <h2 className="font-heading text-3xl text-secondary-foreground mb-4">
              Asteroid Not Found
            </h2>
            <p className="font-paragraph text-lg text-secondary-foreground opacity-70 mb-8">
              The requested Near-Earth Object could not be located in our database.
            </p>
            <Link to="/dashboard">
              <button className="bg-accentcyan text-primary font-paragraph text-base px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                Return to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative bg-primary text-primary-foreground py-20 px-8 md:px-16 overflow-hidden">
              <div className="absolute inset-0">
                <Image 
                  src="https://static.wixstatic.com/media/21621a_8cd747beed6e416085c97fb8eb7d1454~mv2.png?originWidth=1152&originHeight=576"
                  alt="Space background"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              
              <div className="relative z-10 max-w-[100rem] mx-auto">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-accentcyan hover:opacity-80 transition-opacity mb-8">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-paragraph text-base">Back to Dashboard</span>
                </Link>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                    <div>
                      <h1 className="font-heading text-5xl md:text-6xl mb-4">
                        {neo.name || 'Unknown Object'}
                      </h1>
                      <p className="font-paragraph text-lg opacity-80">
                        Reference ID: {neo.referenceId || 'N/A'}
                      </p>
                    </div>
                    
                    {neo.isHazardous && (
                      <div className="bg-destructive text-destructiveforeground px-6 py-3 rounded-full flex items-center gap-3 self-start md:self-center">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-heading text-xl">Potentially Hazardous</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Risk Analysis Section */}
            <section className="bg-secondary py-16 px-8 md:px-16">
              <div className="max-w-[100rem] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-heading text-4xl text-secondary-foreground mb-8">
                    Risk Analysis
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                      <Gauge className="w-12 h-12 text-accentcyan mb-4" />
                      <h3 className="font-heading text-2xl mb-2">Risk Score</h3>
                      <p className={`font-heading text-5xl mb-2 ${getRiskColor(neo.riskScore)}`}>
                        {neo.riskScore?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="font-paragraph text-base opacity-80">
                        {getRiskLevel(neo.riskScore)}
                      </p>
                    </div>
                    
                    <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                      <MapPin className="w-12 h-12 text-accentcyan mb-4" />
                      <h3 className="font-heading text-2xl mb-2">Miss Distance</h3>
                      <p className="font-heading text-4xl mb-2">
                        {neo.missDistance ? `${(neo.missDistance / 1000000).toFixed(2)}M` : 'N/A'}
                      </p>
                      <p className="font-paragraph text-base opacity-80">
                        kilometers from Earth
                      </p>
                    </div>
                    
                    <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                      <Zap className="w-12 h-12 text-accentcyan mb-4" />
                      <h3 className="font-heading text-2xl mb-2">Velocity</h3>
                      <p className="font-heading text-4xl mb-2">
                        {neo.relativeVelocity ? neo.relativeVelocity.toFixed(0) : 'N/A'}
                      </p>
                      <p className="font-paragraph text-base opacity-80">
                        km/h relative speed
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Physical Characteristics */}
            <section className="bg-primary text-primary-foreground py-16 px-8 md:px-16">
              <div className="max-w-[100rem] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-heading text-4xl mb-8">
                    Physical Characteristics
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-secondary text-secondary-foreground p-8 rounded-lg">
                      <div className="flex items-start gap-4">
                        <Ruler className="w-10 h-10 text-accentcyan flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-heading text-2xl mb-4">Estimated Diameter</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="font-paragraph text-base opacity-80">Minimum:</span>
                              <span className="font-heading text-xl">
                                {neo.estimatedDiameterMin?.toFixed(2) || 'N/A'} km
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-paragraph text-base opacity-80">Maximum:</span>
                              <span className="font-heading text-xl">
                                {neo.estimatedDiameterMax?.toFixed(2) || 'N/A'} km
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-secondary-foreground border-opacity-20">
                              <span className="font-paragraph text-base opacity-80">Average:</span>
                              <span className="font-heading text-xl text-accentcyan">
                                {neo.estimatedDiameterMin && neo.estimatedDiameterMax
                                  ? ((neo.estimatedDiameterMin + neo.estimatedDiameterMax) / 2).toFixed(2)
                                  : 'N/A'} km
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary text-secondary-foreground p-8 rounded-lg">
                      <div className="flex items-start gap-4">
                        <Calendar className="w-10 h-10 text-accentcyan flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-heading text-2xl mb-4">Close Approach</h3>
                          <div className="space-y-3">
                            <div>
                              <span className="font-paragraph text-base opacity-80 block mb-2">Next Approach Date:</span>
                              <span className="font-heading text-xl text-accentcyan">
                                {neo.nextCloseApproachDatetime
                                  ? format(new Date(neo.nextCloseApproachDatetime), 'MMMM dd, yyyy')
                                  : 'N/A'}
                              </span>
                            </div>
                            {neo.nextCloseApproachDatetime && (
                              <div className="pt-3 border-t border-secondary-foreground border-opacity-20">
                                <span className="font-paragraph text-base opacity-80 block mb-2">Time:</span>
                                <span className="font-heading text-xl">
                                  {format(new Date(neo.nextCloseApproachDatetime), 'HH:mm:ss')} UTC
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Additional Info */}
            <section className="bg-secondary py-16 px-8 md:px-16">
              <div className="max-w-[100rem] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-primary text-primary-foreground p-10 rounded-lg"
                >
                  <h2 className="font-heading text-3xl mb-6">About This Object</h2>
                  <p className="font-paragraph text-lg leading-relaxed opacity-90 mb-6">
                    This Near-Earth Object has been classified {neo.isHazardous ? 'as potentially hazardous' : 'as non-hazardous'} based on its orbital characteristics and proximity to Earth. 
                    The risk assessment takes into account multiple factors including diameter, velocity, and miss distance.
                  </p>
                  <p className="font-paragraph text-base leading-relaxed opacity-80">
                    Data sourced from NASA's Near-Earth Object Web Service (NeoWs). All measurements and calculations are based on the latest available orbital data 
                    and are subject to updates as new observations are made.
                  </p>
                </motion.div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
