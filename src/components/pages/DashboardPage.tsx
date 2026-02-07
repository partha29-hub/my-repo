import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { NearEarthObjects } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [neos, setNeos] = useState<NearEarthObjects[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHazardous, setFilterHazardous] = useState<'all' | 'hazardous' | 'safe'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'distance'>('date');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 12;

  useEffect(() => {
    loadNEOs();
  }, []);

  const loadNEOs = async (skipValue = 0) => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<NearEarthObjects>('nearearthobjects', {}, { limit, skip: skipValue });
    if (skipValue === 0) {
      setNeos(result.items);
    } else {
      setNeos(prev => [...prev, ...result.items]);
    }
    setHasNext(result.hasNext);
    setSkip(result.nextSkip || 0);
    setIsLoading(false);
  };

  const loadMore = () => {
    if (hasNext && !isLoading) {
      loadNEOs(skip);
    }
  };

  const filteredNeos = neos
    .filter(neo => {
      const matchesSearch = !searchTerm || 
        neo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        neo.referenceId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterHazardous === 'all' ||
        (filterHazardous === 'hazardous' && neo.isHazardous) ||
        (filterHazardous === 'safe' && !neo.isHazardous);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.nextCloseApproachDatetime || 0).getTime() - new Date(a.nextCloseApproachDatetime || 0).getTime();
      } else if (sortBy === 'risk') {
        return (b.riskScore || 0) - (a.riskScore || 0);
      } else {
        return (a.missDistance || 0) - (b.missDistance || 0);
      }
    });

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
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 px-8 md:px-16">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-5xl md:text-6xl mb-4">
                NEO Monitoring Dashboard
              </h1>
              <p className="font-paragraph text-lg max-w-3xl opacity-90">
                Real-time tracking of Near-Earth Objects with comprehensive risk analysis and trajectory data.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-secondary py-8 px-8 md:px-16 border-b border-primary border-opacity-10">
          <div className="max-w-[100rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-foreground opacity-50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-primary border-opacity-20 bg-secondary text-secondary-foreground font-paragraph focus:outline-none focus:border-accentcyan transition-colors"
                />
              </div>

              {/* Hazard Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-foreground opacity-50 w-5 h-5" />
                <select
                  value={filterHazardous}
                  onChange={(e) => setFilterHazardous(e.target.value as any)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-primary border-opacity-20 bg-secondary text-secondary-foreground font-paragraph focus:outline-none focus:border-accentcyan transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All Objects</option>
                  <option value="hazardous">Hazardous Only</option>
                  <option value="safe">Safe Only</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-foreground opacity-50 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-primary border-opacity-20 bg-secondary text-secondary-foreground font-paragraph focus:outline-none focus:border-accentcyan transition-colors appearance-none cursor-pointer"
                >
                  <option value="date">Sort by Date</option>
                  <option value="risk">Sort by Risk Score</option>
                  <option value="distance">Sort by Distance</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* NEO Grid */}
        <section className="py-16 px-8 md:px-16 bg-secondary">
          <div className="max-w-[100rem] mx-auto min-h-[600px]">
            {isLoading && neos.length === 0 ? null : (
              <>
                {filteredNeos.length === 0 ? (
                  <div className="text-center py-20">
                    <AlertTriangle className="w-16 h-16 text-secondary-foreground opacity-30 mx-auto mb-4" />
                    <p className="font-paragraph text-xl text-secondary-foreground opacity-70">
                      No asteroids found matching your criteria
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {filteredNeos.map((neo, index) => (
                      <motion.div
                        key={neo._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Link to={`/neo/${neo._id}`}>
                          <div className="bg-primary text-primary-foreground rounded-lg overflow-hidden hover:bg-opacity-90 transition-all h-full">
                            <div className="relative h-48">
                              <Image 
                                src="https://static.wixstatic.com/media/21621a_b8d19acb517446989e3637f9f63e60fa~mv2.png?originWidth=256&originHeight=192"
                                alt={neo.name || 'Asteroid'}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-darkgrayoverlay opacity-60"></div>
                              {neo.isHazardous && (
                                <div className="absolute top-4 right-4 bg-destructive text-destructiveforeground px-3 py-1 rounded-full flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span className="font-paragraph text-sm font-semibold">Hazardous</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-6">
                              <h3 className="font-heading text-xl mb-2 text-accentcyan">
                                {neo.name || 'Unknown'}
                              </h3>
                              <p className="font-paragraph text-sm opacity-70 mb-4">
                                ID: {neo.referenceId || 'N/A'}
                              </p>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="font-paragraph text-sm opacity-80">Risk Score:</span>
                                  <span className={`font-heading text-lg ${getRiskColor(neo.riskScore)}`}>
                                    {neo.riskScore?.toFixed(1) || 'N/A'}
                                  </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="font-paragraph text-sm opacity-80">Miss Distance:</span>
                                  <span className="font-paragraph text-sm">
                                    {neo.missDistance ? `${(neo.missDistance / 1000000).toFixed(2)}M km` : 'N/A'}
                                  </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="font-paragraph text-sm opacity-80">Velocity:</span>
                                  <span className="font-paragraph text-sm">
                                    {neo.relativeVelocity ? `${neo.relativeVelocity.toFixed(0)} km/h` : 'N/A'}
                                  </span>
                                </div>
                                
                                {neo.nextCloseApproachDatetime && (
                                  <div className="flex items-center gap-2 pt-2 border-t border-primary-foreground border-opacity-20">
                                    <Calendar className="w-4 h-4 text-accentcyan" />
                                    <span className="font-paragraph text-sm">
                                      {format(new Date(neo.nextCloseApproachDatetime), 'MMM dd, yyyy')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Load More */}
                {hasNext && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      disabled={isLoading}
                      className="bg-accentcyan text-primary font-paragraph text-base px-10 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <LoadingSpinner /> : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
